// IE -> EDGE 우회
var url = 'http://nstream.kr'
if (navigator.userAgent.indexOf('Trident') > 0) {
  alert(
    '이 웹페이지는 Microsoft Edge, Chrome, Whale, FireFox 브라우저에 최적화 되어있습니다. ' +
      '원활한 사용을 위해 위의 브라우저를 권장합니다.  확인버튼을 누르면 Edge 브라우저로 자동으로 이동됩니다.'
  )
  window.location = 'microsoft-edge:' + url
  window.close()
} else if (/MSIE \d |Trident.*rv:/.test(navigator.userAgent)) {
  alert(
    '이 웹페이지는 Microsoft Edge, Chrome, Whale, FireFox 브라우저에 최적화 되어있습니다. ' +
      '원활한 사용을 위해 위의 브라우저를 권장합니다.  확인버튼을 누르면 Edge 브라우저로 자동으로 이동됩니다.'
  )
  window.location = 'microsoft-edge:' + url
  window.close()
}

const agent = navigator.userAgent.toLowerCase()
const today = new Date().getDate()
const Dday = new Date('2022-11-30').getDate()
const isToday = () => {
  console.log(today, Dday, new Date().getHours())
  // return today === Dday
  return true
}
const input_account = $('#account-input')
const input_name = $('#name-input')
const nameCheck = /^[가-힣a-zA-Z\s]+$/

$(window).on('load', function () {
  console.log('로그인 페이지')
  removeMask()
  console.log(isToday())
  if (!isToday()) {
    Swal.fire({
      icon: 'info',
      title: '접속 가능 기간이 아닙니다',
      text: '2022년 11월 30일에 접속이 가능합니다',
      confirmButtonColor: '#ff7777',
    })
  }
})

$('#submitBtn').on('click', (e) => {
  if (!isToday()) {
    notice()
  } else {
    loginButtonClick()
  }
})

// 엔터키 반응
input_account.keypress(function (key) {
  if (key.keyCode == 13) {
    $('#submitBtn').click()
  }
})
input_name.keypress(function (key) {
  if (key.keyCode == 13) {
    $('#submitBtn').click()
  }
})

function removeMask() {
  document.getElementById('mask').classList.add('off')
}

function loginButtonClick() {
  if (!input_account.val()) {
    try {
      Swal.fire({
        icon: 'warning',
        title: '소속을 입력해주세요',
        confirmButtonColor: '#ff7777',
      })
    } catch (error) {
      console.log(error)
      alert('소속을 입력해주세요')
    }
    return false
  }

  if (!input_name.val()) {
    Swal.fire({
      icon: 'warning',
      title: '성함을 입력해주세요',
      confirmButtonColor: '#ff7777',
    })
    return false
  } else {
    if (!nameCheck.test(input_name.val())) {
      Swal.fire({
        icon: 'warning',
        title: '성함은 한글과\n영문만 입력해주세요',
        confirmButtonColor: '#ff7777',
      })
      return false
    }
  }

  const postData = {
    account: input_account.val(),
    name: input_name.val(),
  }
  login(postData)
}

function login(postData) {
  $.ajax({
    url: '/users',
    type: 'POST',
    data: postData,
    dataType: 'JSON',
    success: function (res) {
      switch (res.ok) {
        case true: {
          // if (res.role === '관리자') {
          if (true) {
            Swal.fire({
              title: '이동할 페이지 선택',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              confirmButtonText: '관리자 페이지',
              cancelButtonColor: '#d33',
              cancelButtonText: '시청 페이지',
            })
              .then(function (res) {
                $('body').css('display', 'none')
                return res
              })
              .then(function (result) {
                if (result.isConfirmed) {
                  location.href = '/admin?acc=' + postData.account
                } else {
                  location.href = `/home?acc=${postData.account}&name=${postData.name}`
                }
              })
            break
          }
          try {
            Swal.fire({
              icon: 'success',
              title: '로그인 되었습니다',
              confirmButtonColor: '#ff7777',
            })
              .then(function () {
                $('#mask').removeClass('off')
              })
              .then(function () {
                location.href = `/home?acc=${postData.account}&name=${postData.name}`
              })
          } catch (error) {
            console.log(error)
            document.getElementsById('body').style.display = 'none'
            location.href = `/home?acc=${postData.account}&name=${postData.name}`
          }
          break
        }
        /* 로그인 실패 */
        case false: {
          Swal.fire({
            icon: 'warning',
            title: '로그인 실패',
            text: '소속과 성함을 확인해주세요',
            confirmButtonColor: '#ff7777',
          }).then(function () {
            input_account.val('')
            isInvalid(input_account, '')
            input_name.val('')
            isInvalid(input_name, '')
          })
          break
        }
        /* 로그인 실패 : 서버오류 */
        default: {
          Swal.fire({
            icon: 'warning',
            title: '로그인 실패',
            text: '서버에서 응답을 받지 못했습니다',
            confirmButtonColor: '#ff7777',
          })
          break
        }
      }
    },
  })
}

function notice() {
  const postData = {
    account: input_account.val(),
    name: input_name.val(),
  }

  if (postData.account === '000000' && postData.name === '관리자') {
    location.href = `/home?acc=${postData.account}&name=${postData.name}`
  } else {
    if (!isToday()) {
      Swal.fire({
        icon: 'info',
        title: '접속 가능 기간이 아닙니다',
        text: '2022년 11월 30일에 접속 가능합니다',
        confirmButtonColor: '#ff7777',
      })
    }
  }
}

function isValid(inputDOM, text) {
  const noti = inputDOM.parents('.input-wrapper').find('.notification')
  inputDOM.addClass('border-green-500')
  inputDOM.removeClass('border-red-500')
  noti.text(text).removeClass('text-red-500').addClass('text-green-500')
}

function isInvalid(inputDOM, text) {
  const noti = inputDOM.parents('.input-wrapper').find('.notification')
  inputDOM.addClass('border-red-500')
  inputDOM.removeClass('border-green-500')
  noti.text(text).removeClass('text-green-500').addClass('text-red-500')
}

input_account.on('blur', function () {
  if (input_account.val()) {
    isValid(input_account, '✔')
  } else {
    isInvalid(input_account, '소속을 입력해주세요')
  }
})
input_name.on('blur', function () {
  if (input_name.val()) {
    if (nameCheck.test(input_name.val())) {
      isValid(input_name, '✔')
    } else {
      isInvalid(input_name, '한글과 영문만 입력해주세요')
    }
  } else {
    isInvalid(input_name, '성함을 입력해주세요')
  }
})
