var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var tarefas = new List<Tarefa>
{
    new(1, "Estudar Node.js", true),
    new(2, "Criar API com Express", false)
};
var trava = new object();
const string tokenValido = "123456";

app.Use(async (context, next) =>
{
    Console.WriteLine(
        $"[{DateTimeOffset.UtcNow:O}] {context.Request.Method} {context.Request.Path}");
    await next();
});

var protegidas = app.MapGroup("/tarefas").AddEndpointFilter(async (context, next) =>
{
    var token = context.HttpContext.Request.Headers["x-token"].ToString();
    if (token != tokenValido)
    {
        return Results.Json(
            new { erro = "Token inválido. Acesso negado." },
            statusCode: StatusCodes.Status401Unauthorized);
    }

    return await next(context);
});

app.MapGet("/tarefas", () =>
{
    lock (trava)
    {
        return Results.Ok(tarefas.ToArray());
    }
});

protegidas.MapPost("", (TarefaRequest request) =>
{
    lock (trava)
    {
        var proximoId = tarefas.Count == 0 ? 1 : tarefas.Max(tarefa => tarefa.Id) + 1;
        var nova = new Tarefa(
            proximoId,
            request.Descricao,
            request.Concluida ?? false);
        tarefas.Add(nova);
        return Results.Json(nova, statusCode: StatusCodes.Status201Created);
    }
});

protegidas.MapPut("/{id}", (string id, TarefaRequest request) =>
{
    if (!int.TryParse(id, out var idTarefa))
    {
        return ResultadosNaoEncontrada();
    }

    lock (trava)
    {
        var indice = tarefas.FindIndex(tarefa => tarefa.Id == idTarefa);
        if (indice == -1)
        {
            return ResultadosNaoEncontrada();
        }

        var atual = tarefas[indice];
        var descricao = !string.IsNullOrEmpty(request.Descricao)
            ? request.Descricao
            : atual.Descricao;
        var atualizada = new Tarefa(
            atual.Id,
            descricao,
            request.Concluida ?? atual.Concluida);
        tarefas[indice] = atualizada;
        return (IResult)Results.Ok(atualizada);
    }
});

protegidas.MapDelete("/{id}", (string id) =>
{
    if (!int.TryParse(id, out var idTarefa))
    {
        return ResultadosNaoEncontrada();
    }

    lock (trava)
    {
        var indice = tarefas.FindIndex(tarefa => tarefa.Id == idTarefa);
        if (indice == -1)
        {
            return ResultadosNaoEncontrada();
        }

        tarefas.RemoveAt(indice);
        return (IResult)Results.NoContent();
    }
});

app.Run();

static IResult ResultadosNaoEncontrada() =>
    Results.Json(
        new { erro = "Tarefa não encontrada" },
        statusCode: StatusCodes.Status404NotFound);

record Tarefa(int Id, string? Descricao, bool Concluida);
record TarefaRequest(string? Descricao, bool? Concluida);
