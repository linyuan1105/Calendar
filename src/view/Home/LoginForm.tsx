import styles from './style.module.less'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../store/hooks'
import { setUser } from '../../store/features/user/userSlice'

interface IProps {
  setState:(s:string)=>void
}

export function LoginForm(props:IProps) {
  const { setState, } = props
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const onchange = (event:React.ChangeEvent<HTMLInputElement>, type:string) => {
    const value = event.target.value
    switch (type) {
    case 'userName':{
      setUserName(value)
      break
    }
    case 'password':{
      setPassword(value)
      break
    }
    default:{
      break
    }
    }
  }
  const onRegister = () => {
    setState('register')
  }
  const onLogin = () => {
    const params = {
      userName,
      password,
      userId: 0,
      avatarUrl: 'https://avatars.githubusercontent.com/u/44738166?v=4',
      userEmail: 'yuanlincuc@gmail.com',
    }
    dispatch(setUser(params))
    navigate('/calendar')
  }
  return (
    <div className={styles.containerFormContainer}>
      <div className={styles.containerForm}>
        <TextField
          error={true}
          defaultValue={userName}
          className={styles.containerFormItem}
          placeholder='邮箱或手机号' variant='outlined'
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => onchange(e, 'userName') } />
        <TextField
          defaultValue={password}
          className={styles.containerFormItem}
          placeholder='密码' variant='outlined'
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => onchange(e, 'password') } />
        <Button
          onClick={onLogin}
          className={styles.containerFormItem}
          variant="contained"
          size="large">
          登录
        </Button>
        <div className={styles.containerFormForget}>
          <span className={styles.containerFormForgetText}>忘记密码？</span>
        </div>
      </div>
      <div className={styles.containerFormFooter}>
        <Button
          onClick={onRegister}
          variant="contained"
          color="success"
          size="large">
          新建账户
        </Button>
      </div>
    </div>
  )
}
