$(document).ready(function () {
  //Only needed for the filename of export files.
  //Normally set in the title tag of your page.
  document.title = 'DataTable Excel'
  // DataTable initialisation
  var table = $('#example').DataTable({
    dom: '<"dt-buttons"Bf><"clear">lirtp',
    paging: true,
    autoWidth: true,
    pagelength: 10,
    ajax: {
      url: '/question/data',
      type: 'GET',
      dataSrc: '',
    },
    columns: [
      { data: 'name', width: '7%' },
      { data: 'account', width: '10%' },
      { data: 'context', width: '65%' },
      { data: 'createdAt' },
    ],
  })

  setInterval(() => {
    table.ajax.reload()
  }, 1000 * 5)
})
