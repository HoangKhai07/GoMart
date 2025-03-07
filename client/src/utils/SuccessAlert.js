import Swal from 'sweetalert2'
const successAlert = (title) => {
    const alert = Swal.fire({
        title: title,
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      return alert
}

export default successAlert