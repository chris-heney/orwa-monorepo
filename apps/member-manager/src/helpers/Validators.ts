export const isValidNumber = (value: string | number): boolean => {
  const regNumber = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/g
  if (!regNumber.test(value.toString())) {
    return true
  } else {
    return false
  }
}

export const isValidEmail = (email: string) => {
  const regEmail =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!regEmail.test(email)) {
    return true
  } else {
    return false
  }
}

export const isValidPhoneOrSSNNumber = (phone: string) => {
  const regPhone = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/
  if (!regPhone.test(phone)) {
    return true
  } else {
    return false
  }
}
