export const validateUser = (user) => {

  if (!user.name || !user.email || !user.password) {
    throw new Error("Dados obrigatórios ausentes");
  }


  if (typeof user.name == "number") {
    throw new Error("Nome deve ser uma string");
  }


  return true;
};

