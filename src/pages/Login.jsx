import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Login({ setLoginSuccess }) {

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      navigate('/home')
      setLoginSuccess(true)
      localStorage.setItem('loginSuccess', true)
    } else {
      navigate('/')
      setLoginSuccess(false)
      localStorage.setItem('loginSuccess', false)
    }
  }, [])

  const logInSite = (e) => {
    e.preventDefault()

    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            phone_number: phone,
            password: password
        })
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.success === true) {
          localStorage.setItem('accessToken', data.data.tokens.accessToken.token)
          document.getElementById('phone').value = ''
          document.getElementById('password').value = ''
          setLoginSuccess(true)
          localStorage.setItem('loginSuccess', true)
          navigate('/home')
        } else {
          setLoginSuccess(false)
          localStorage.setItem('loginSuccess', false)
          document.getElementById('login_error_message').textContent = 'Phone number or password is wrong!!!'
          setTimeout(() => {
            document.getElementById('login_error_message').textContent = ''
          }, 3000);
        }
    })
    .catch((err) => console.log(err))
  }

  return (
    <div className="mt-40">
        <form onSubmit={logInSite} className="mx-auto flex flex-col text-center w-[40%] min-w-[300px] p-10 bg-gray-300">
            <input id="phone" type="number" placeholder="Enter your number" min={3} className="border-2 border-cyan-700 my-5" onChange={(e) => setPhone(e.target.value)}/>
            <input id="password" type="password" placeholder="Enter your password" min={3} className="border-2 border-cyan-700 my-5" onChange={(e) => setPassword(e.target.value)}/>
            <p id="login_error_message" className="text-red-900 font-semibold"></p>
            <button type="submit" className="border-2 border-cyan-700 my-5">Submit</button>
        </form>
    </div>
  )
}

export default Login