const {Command} = require('commander');

//Si ejecuto "node process.js 1 2 3"
console.log(process.argv.slice(2)) //[1,2,3]

const program = new Command();// Inicializamos un nuevo comando de commander
program
  .option('-d , Variable para debug', false) // primero: el comando, segundo: descripcion, tercero: valor por defecto
  .option('-p <port>', 'puerto del servidor', 8080) // port es el puerto a colocar
  .option('--m <mode>', 'modo de  trabajo', 'production') // <mode> es el modo a colocar
  .requiredOption('-u <username>', 'userio utilizando el aplicativo', 'No se ha declarado un usario ') // para rquiredOption el tercer arg es un mensaje de error
  .option('-c, --letters [letters...]', 'specify letters')
program.parse(); // parsea se utiliza para cerrar la configuracion de comandos

console.log('Options:', program.opts())
console.log('remaining arguments:', program.args)
