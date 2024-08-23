import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
};

// Testes Unitários
// Testes de Integração
// Testes E2E

test("Deve criar uma reserva com sucesso", async () => {
  // preparar (arrange)
  const body = {
    guestName: "John Doe",
    guestEmail: "john@doe.com",
    roomId: crypto.randomUUID(),
    date: "2024-12-31",
  };

  // executar a ação (act)
  const response = await axios.post("http://localhost:3000/booking", body);

  // esperar o resultado (assert)
  expect(response.status).toBe(200);
  expect(response.data.bookingId).toBeDefined();
  expect(response.data.message).toBe("Booking confirmed!");
});

test("Deve lançar um erro caso o agendamento para uma sala e data já exista", async () => {
  // preparar (arrange)
  const roomId = crypto.randomUUID();
  const date = "2024-12-31";
  const body = {
    guestName: "John Doe",
    guestEmail: "john@doe.com",
    roomId,
    date,
  };

  // executar a ação (act)
  await axios.post("http://localhost:3000/booking", body);
  const response = await axios.post("http://localhost:3000/booking", body);

  // esperar o resultado (assert)
  expect(response.status).toBe(422);
  expect(response.data).toBe("Booking already exists.");
});

test("Deve lançar um erro caso o nome seja inválido", async () => {
  const body = {
    guestName: "John",
    guestEmail: "john@doe.com",
    roomId: crypto.randomUUID(),
    date: "2024-12-31",
  };

  const response = await axios.post("http://localhost:3000/booking", body);

  expect(response.status).toBe(422);
  expect(response.data).toBe("Invalid name");
});

test("Deve lançar um erro caso o e-mail seja inválido", async () => {
  const body = {
    guestName: "John Doe",
    guestEmail: "john.com",
    roomId: crypto.randomUUID(),
    date: "2024-12-31",
  };

  const response = await axios.post("http://localhost:3000/booking", body);

  expect(response.status).toBe(422);
  expect(response.data).toBe("Invalid e-mail");
});

test("Deve lançar um erro caso a data seja inválida", async () => {
  const body = {
    guestName: "John Doe",
    guestEmail: "john.com",
    roomId: crypto.randomUUID(),
    date: "abc",
  };

  const response = await axios.post("http://localhost:3000/booking", body);

  expect(response.status).toBe(500);
  expect(response.data).toBe("Internal server error");
});
