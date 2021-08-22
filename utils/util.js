//时间戳转换成日期时间
const formatTime = unixtime => {
  // var dateTime = new Date(parseInt(unixtime) * 1000)
  var dateTime = new Date(parseInt(unixtime))
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  if (hour === 0) {
    hour = '00'
  }
  if (hour.toString().length === 1) {
    hour = `0${hour}`
  }
  var minute = dateTime.getMinutes();
  if (minute === 0) {
    minute = '00'
  }
  if (minute.toString().length === 1) {
    minute = `0${minute}`
  }
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString()); //typescript转换写法
  var milliseconds = now_new - dateTime;
  var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  return timeSpanStr;
}
//时间戳转换方法    date:时间戳数字
const formatDate = (date) => {
  var date = new Date(date);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + MM + DD;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const numbuerS = function (val, number = 2, isThousands = true) {
  val = parseFloat(val).toString()
  if (val) {
    let n = number,
      s = val;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
      r = s.split(".")[1];
    let t = "";

    for (var i = 0; i < l.length; i++) {
      if (isThousands) {
        if (l.length - 2 == i && l[l.length - 1] == '-') {
          t += l[i] + "";
        } else {
          t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
      } else {
        t += l[i] + "";
      }
    }
    return t.split('').reverse().join('') + "." + r;
  }
  //parseFloat(row.localCurrency).toString()
  return '0.00';
}

//图片名称处理
const imgNameFormatter = function (name) {
  if (!name) return ''
  if (name.indexOf('_') > 0) {
    name = name.split('_')
  } else {
    return name
  }
  let nameR = ''
  if (name[name.length - 1].indexOf('.') > 0) {
    nameR = name[name.length - 1].split('.')
  } else {
    return name[0]
  }
  if (name.length == 2) {
    return name[0] + '.' + nameR[nameR.length - 1]
  } else if (name.length > 2) {
    let nameS = ''
    for (let i = 0; i < name.length - 1; i++) {
      if (i < name.length - 2) {
        nameS += name[i] + '_'
      } else {
        nameS += name[i]
      }
    }
    return nameS + '.' + nameR[nameR.length - 1]
  } else {
    return name[0] + '.'
  }
}
//手机号码验证 ,验证通过返回true
const telTest = function (value) {
  if (!value || value == '') {
    wx.showToast({
      title: '请输入手机号码',
      icon: "none"
    })
    return false
  }
  if (value) {
    value = value.toString().trim()
  }
  if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))) {
    wx.showToast({
      title: '手机号码有误，请重新输入',
      icon: "none"
    })
    return false
  }
  return true

}
//邮箱验证 ,验证通过返回true
const emailTest = function (value) {
  // 规则:以数字字母开头,中间可以有多个数字字母下划线
  //     然后以"@"符号,后面是数字字母
  //     然后是"."符号加2-4个字母结尾
  if (!value || value == '') {
    wx.showToast({
      title: '请输入邮箱',
      icon: "none"
    })
    return false
  }
  if (value) {
    value = value.toString().trim()
  }
  // var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  var reg = /^(([^()[\]\\.,;:\s@\"]+(\.[^()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!reg.test(value)) {
    wx.showToast({
      title: '邮箱格式不正确，请重新输入',
      icon: "none"
    })
    return false
  }
  return true

}
//身份证号验证 ,验证通过返回true
const identityNumTest = function (value) {
  if (!value || value == '') {
    wx.showToast({
      title: '请输入身份证号',
      icon: "none"
    })
    return false
  }
  if (value) {
    value = value.toString().trim()
  }
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!reg.test(value)) {
    wx.showToast({
      title: '身份证号不正确，请重新输入',
      icon: "none"
    })
    return false
  }
  return true

}
//密码验证(规则:密码格式：8-16位，至少包含数字、大写字母、小写字母,特殊字符中的两种),验证通过返回true
const passworderTest = function (value) {
  // ：密码中必须包含大小写 字母、数字、特称字符，至少8个字符，最多30个字符；
  // var pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,16}');
  //由非空格字符组成的字符串，数字，大写字母，小写字母，特殊字符至少有 两种,
  var pwdRegex = new RegExp('^(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$)\\S+$'); //包含特殊字符
  if (!pwdRegex.test(value) || value.length < 8 || value.length > 16) {
    wx.showToast({
      title: '密码格式不正确,应包含数字、大写字母、小写字母中的两种，并且8至16个字符',
      icon: "none",
      duration: 3000
    })
    return false
  }
  return true

}
// 只可以输入金额控制   value:值  isFuShu:是否可以输入负数
const onlyNumber = function (value, isFuShu) {
  //得到第一个字符是否为负号    
  var t = value.charAt(0);
  //先把非数字的都替换掉，除了数字和.和-号    
  if (isFuShu) {
    value = value.replace(/[^\d\.\-]/g, '');
  } else {
    value = value.replace(/[^\d\.]/g, '');
  }
  //前两位不能是0加数字      
  value = value.replace(/^0\d[0-9]*/g, '');
  //必须保证第一个为数字而不是.       
  value = value.replace(/^\./g, '');
  //保证只有出现一个.而没有多个.       
  value = value.replace(/\.{2,}/g, '.');
  //保证.只出现一次，而不能出现两次以上       
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  return value
}
//获取当前日期
const dateCurrent = function () {
  let date = new Date()
  let Y = date.getFullYear();
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  let D = date.getDate();
  let h = date.getHours() + ':';
  let m = date.getMinutes() + ':';
  let s = date.getSeconds();
  let cDate = `${Y}-${M}-${D}`
  return cDate
}

module.exports = {
  formatTime: formatTime,
  numbuerS,
  formatDate,
  imgNameFormatter,
  telTest,
  passworderTest,
  identityNumTest,
  onlyNumber,
  dateCurrent,
  emailTest
}