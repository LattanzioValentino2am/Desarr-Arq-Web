window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const fields = {
        nombre: {
            element: document.getElementById('nombre'),
            validate: value => value.length > 6 && value.includes(' '),
            message: 'Debe tener más de 6 letras y al menos un espacio.'
        },
        email: {
            element: document.getElementById('email'),
            validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Formato de email no válido.'
        },
        password: {
            element: document.getElementById('password'),
            validate: value => /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(value),
            message: 'Debe tener al menos 8 caracteres, letras y números.'
        },
        repeatPassword: {
            element: document.getElementById('repeat-password'),
            validate: value => value === fields.password.element.value,
            message: 'Las contraseñas no coinciden.'
        },
        edad: {
            element: document.getElementById('edad'),
            validate: value => Number.isInteger(+value) && +value >= 18,
            message: 'Debe ser un número mayor o igual a 18.'
        },
        telefono: {
            element: document.getElementById('telefono'),
            validate: value => /^\d{7,}$/.test(value),
            message: 'Debe contener al menos 7 dígitos sin símbolos.'
        },
        direccion: {
            element: document.getElementById('direccion'),
            validate: value => value.length >= 5 && /[a-zA-Z]/.test(value) && /\d/.test(value) && /\s/.test(value),
            message: 'Debe tener letras, números y un espacio, mínimo 5 caracteres.'
        },
        ciudad: {
            element: document.getElementById('ciudad'),
            validate: value => value.length >= 3,
            message: 'Debe tener al menos 3 caracteres.'
        },
        codigoPostal: {
            element: document.getElementById('codigo-postal'),
            validate: value => value.length >= 3,
            message: 'Debe tener al menos 3 caracteres.'
        },
        dni: {
            element: document.getElementById('dni'),
            validate: value => /^\d{7,8}$/.test(value),
            message: 'Debe tener 7 u 8 dígitos.'
        }
    };

    const showError = (input, message) => {
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains('error')) {
            error = document.createElement('small');
            error.classList.add('error');
            input.parentNode.insertBefore(error, input.nextSibling);
        }
        error.textContent = message;
    };

    const clearError = input => {
        const error = input.nextElementSibling;
        if (error && error.classList.contains('error')) {
            error.remove();
        }
    };

    Object.values(fields).forEach(({ element, validate, message }) => {
        element.addEventListener('blur', () => {
            if (!validate(element.value.trim())) {
                showError(element, message);
            }
        });

        element.addEventListener('focus', () => {
            clearError(element);
        });
    });

   
    form.addEventListener('submit', async e => {
        e.preventDefault();
        let isValid = true;
        const params = new URLSearchParams();

        Object.entries(fields).forEach(([key, { element, validate, message }]) => {
            const value = element.value.trim();
            if (!validate(value)) {
                showError(element, message);
                isValid = false;
            } else {
                params.append(key, value);
            }
        });

        if (!isValid) {
            mostrarModal('Formulario inválido. Verificá los campos marcados.');
            return;
        }

        try {
            const url = `http://curso-dev-2021.herokuapp.com/newsletter?${params.toString()}`;
            const response = await fetch(url);

            const data = await response.json();

            if (response.ok) {
                mostrarModal(`✅ Suscripción exitosa.<br><br><strong>Respuesta:</strong><br>${JSON.stringify(data)}`);
                localStorage.setItem('datosNewsletter', JSON.stringify(Object.fromEntries(params)));
            } else {
                mostrarModal(`❌ Error en la suscripción.<br><br><strong>Detalles:</strong><br>${data?.error || 'Error desconocido.'}`);
            }
        } catch (err) {
            mostrarModal('⚠️ Error de conexión con el servidor.');
        }
    
    });

    function mostrarModal(mensaje) {
        const modal = document.getElementById('modal');
        const contenido = document.getElementById('modal-mensaje');
        contenido.innerHTML = mensaje;
        modal.classList.remove('oculto');
    }

    document.getElementById('cerrar-modal').addEventListener('click', () => {
        document.getElementById('modal').classList.add('oculto');
    });

    // Cargar valores previos si existen
    const datosPrevios = localStorage.getItem('datosNewsletter');
    if (datosPrevios) {
        const datos = JSON.parse(datosPrevios);
        Object.entries(fields).forEach(([key, { element }]) => {
            if (datos[key]) {
                element.value = datos[key];
            }
        });
    }


});