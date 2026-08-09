
let users = [];      
let nextId = 1;     


function findUserByEmail(email) {
  return users.find((u) => u.email === email);
}


function addUser(email, hashedPassword) {
  const newUser = {
    id: nextId++,
    email,
    password: hashedPassword, 
  };
  users.push(newUser);
  return newUser;
}

function findUserById(id) {
  return users.find((u) => u.id === id);
}

function getAllUsers() {
  return users;
}

module.exports = {
  findUserByEmail,
  addUser,
  findUserById,
  getAllUsers,
};
