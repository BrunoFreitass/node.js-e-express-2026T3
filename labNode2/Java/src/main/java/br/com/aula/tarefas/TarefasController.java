package br.com.aula.tarefas;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tarefas")
public class TarefasController {
    private final List<Tarefa> tarefas = new ArrayList<>(List.of(
            new Tarefa(1, "Estudar Node.js", true),
            new Tarefa(2, "Criar API com Express", false)));

    @GetMapping
    public synchronized List<Tarefa> listar() {
        return List.copyOf(tarefas);
    }

    @PostMapping
    public synchronized ResponseEntity<Tarefa> criar(@RequestBody TarefaRequest request) {
        int proximoId = tarefas.stream()
                .mapToInt(Tarefa::id)
                .max()
                .orElse(0) + 1;
        Tarefa nova = new Tarefa(
                proximoId,
                request.descricao(),
                Boolean.TRUE.equals(request.concluida()));
        tarefas.add(nova);
        return ResponseEntity.status(HttpStatus.CREATED).body(nova);
    }

    @PutMapping("/{id}")
    public synchronized ResponseEntity<?> atualizar(
            @PathVariable String id,
            @RequestBody TarefaRequest request) {
        int idTarefa = parseId(id);
        int indice = indiceDaTarefa(idTarefa);
        if (indice == -1) {
            return naoEncontrada();
        }

        Tarefa atual = tarefas.get(indice);
        String descricao = request.descricao() != null && !request.descricao().isEmpty()
                ? request.descricao()
                : atual.descricao();
        boolean concluida = request.concluida() != null
                ? request.concluida()
                : atual.concluida();
        Tarefa atualizada = new Tarefa(atual.id(), descricao, concluida);
        tarefas.set(indice, atualizada);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public synchronized ResponseEntity<?> excluir(@PathVariable String id) {
        int indice = indiceDaTarefa(parseId(id));
        if (indice == -1) {
            return naoEncontrada();
        }
        tarefas.remove(indice);
        return ResponseEntity.noContent().build();
    }

    private int indiceDaTarefa(int id) {
        for (int indice = 0; indice < tarefas.size(); indice++) {
            if (tarefas.get(indice).id() == id) {
                return indice;
            }
        }
        return -1;
    }

    private int parseId(String id) {
        try {
            return Integer.parseInt(id);
        } catch (NumberFormatException exception) {
            return -1;
        }
    }

    private ResponseEntity<Map<String, String>> naoEncontrada() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("erro", "Tarefa não encontrada"));
    }
}
