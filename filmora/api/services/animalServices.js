// export const validateUser = (user) => {
//   // ERRO 1: A verificação de falso positivo falha no preço 0 (adoção gratuita)
//   if (!user.name || !user.email || !user.password) {
//     throw new Error("Missing required fields");
//   }

//   // ERRO 2: A verificação estrita de tipo falha se a idade vier como "5" (string) do frontend
//   if (typeof user.age !== "number") {
//     throw new Error("Age must be a number");
//   }

//   // ERRO 3: Sem validação para preço negativo
//   return true;
// };

// export const calculateDiscount = (price, isMember) => {
//   // ERRO 4: Erro de lógica. Subtrai 10 (valor fixo) em vez de 10%
//   if (isMember) {
//     return price - 10;
//   }
//   return price;
// };
