(function() {
    let DB;

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        formulario.addEventListener('submit', validarCliente);

        conectarDB();
    });

    function conectarDB() {
        // ABRIR CONEXIÓN EN LA BD:

        let abrirConexion = window.indexedDB.open('crm', 1);

        // si hay un error, lanzarlo
        abrirConexion.onerror = function() {
            console.log('Hubo un error');
        };
    
        // si todo esta bien, asignar a database el resultado
        abrirConexion.onsuccess = function() {
            // guardamos el resultado
            DB = abrirConexion.result;
        };
    }


    function validarCliente(e) {
        e.preventDefault();
        // leer todos los inputs 

        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === '') {
             
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // crear un objeto con la informacion 

        const cliente = { 

            nombre,
            email,
            telefono,
            empresa
          
        }
        cliente.id = Date.now();

        //console.log(cliente);

        crearNuevoCliente(cliente);


    }
    function crearNuevoCliente(cliente){
              // NUEVO: 
              const transaction = DB.transaction(['crm'], 'readwrite');
              const objectStore = transaction.objectStore('crm');
              // console.log(objectStore);
              objectStore.add(cliente);
              
              transaction.onerror = function() {
                imprimirAlerta('Hubo un error','error');

              };
              transaction.oncomplete = function () {
                  console.log('Cliente Agregado');
      
                  // Mostrar mensaje de que todo esta bien...
                  imprimirAlerta('Se agregó correctamente');
      
                  setTimeout(() => {
                      window.location.href = 'index.html';
                  }, 3000);
                }

    }
    
    function imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const alerta = document.querySelector('.alerta');
        if(!alerta) {  
            // crear alerta
            const divMensaje = document.createElement('div');
        divMensaje.classList.add( "px-4", "py-3", "rounded",  "max-w-lg", "mx-auto", "mt-6", "text-center" ,'alerta');

        if(tipo === 'error') {
           divMensaje.classList.add('bg-red-100', "border-red-400", "text-red-700");
        } else {
            divMensaje.classList.add('bg-green-100', "border-green-400", "text-green-700");
        }
        
        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
       formulario.appendChild(divMensaje);

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
         }
    }
})();         