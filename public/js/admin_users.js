// admin_users.js
async function modifyRole(userId) {
  const { value: newRole } = await Swal.fire({
    title: 'Ingrese el nuevo rol',
    input: 'text',
    inputPlaceholder: 'user/premium',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value || (value !== 'user' && value !== 'premium')) {
        return 'Por favor, ingrese un rol válido (user/premium)';
      }
    }
  });

  if (newRole) {
    try {
      const response = await fetch(`/api/session/modify_role/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      console.log(response)
      if (response.ok) {
        Swal.fire('¡Rol modificado!', '', 'success').then(() => {
          location.reload();
        });
      } else {
        const data = await response.json();
        console.error('Error en la solicitud:', data);
        Swal.fire('Error', `Error al modificar el rol: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }
}

// Función para eliminar un usuario con SweetAlert
async function deleteUser(email) {
  const { isConfirmed } = await Swal.fire({
    title: '¿Está seguro de que desea eliminar este usuario?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminarlo'
  });

  if (isConfirmed) {
    try {
      const response = await fetch('/api/session/delete_users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        Swal.fire('¡Usuario eliminado!', '', 'success').then(() => {
          location.reload();
        });
      } else {
        const data = await response.json();
        Swal.fire('Error', `Error al eliminar el usuario: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }
};

