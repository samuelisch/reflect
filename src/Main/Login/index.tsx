import React, { FormEvent, useEffect, useState } from 'react';
import Button from '../../assets/Button';
import loginCalls, { setToken } from '../../services/login';
import { useDispatch } from 'react-redux';
import { fetch, success, fail } from '../../reducers/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';
import { DecodedTokenSchema, TokenSchema } from '../../utils/types';
import { NegativeToast, PositiveToast } from '../../assets/Toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  useEffect(() => {
    if (!loginUsername.length || !loginPassword.length) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [loginUsername, loginPassword]);

  const loginUser = async (e: FormEvent) => {
    e.preventDefault();
    if (isEmpty) {
      NegativeToast('A required field is empty!');
      return;
    }
    const credentials = { username: loginUsername, password: loginPassword };
    dispatch(fetch());
    try {
      const tokens = await loginCalls.loginUser(credentials);
      if (tokens) {
        dispatch(success(tokens));
        const decodedToken = await loginCalls.getJwtDetails();
        localStorage.setItem('tokenDetails', JSON.stringify(decodedToken as DecodedTokenSchema));
        setToken(tokens as TokenSchema);
        PositiveToast('Successfully logged in');
        navigate('/home');
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
        NegativeToast(error.response.data.detail);
      }
      dispatch(fail(error.response));
    }
  };

  return (
    <div className={styles.Container}>
      <h2 className={styles.Header}>Log in</h2>
      <form onSubmit={loginUser} className={styles.Form}>
        <input
          aria-label="usernameInput"
          className={styles.Input}
          type="text"
          value={loginUsername}
          onChange={e => setLoginUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          aria-label="passwordInput"
          className={styles.Input}
          type="password"
          value={loginPassword}
          onChange={e => setLoginPassword(e.target.value)}
          placeholder="Password"
        />
        <Button className={styles.Button} type="submit" text="Login user" />
      </form>
      <span className={styles.Info}>
        Don't have an account?{' '}
        <span className={styles.Link} onClick={() => navigate('/signup')}>
          Sign up with us
        </span>
      </span>
    </div>
  );
};

export default Login;
