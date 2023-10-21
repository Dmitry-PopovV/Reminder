import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useAppSelector } from "../store";
import { User, setUser as setStoreUser } from "../store/slicers/userSlice"

export function useUser() {
  const [isLoading, setIsLoading] = useState(true);
  const isInProcess = useRef(false);
  const user = useAppSelector();
  const dispatch = useDispatch();


  useEffect(() => {
    if ((!isInProcess.current) && (!user)) {
      isInProcess.current = true;
      axios.get("/api/user")
        .then((res) => {
          setUser(res.data)
        })
        .catch(() => { })
        .finally(() => {
          if (isLoading) {
            setIsLoading(false);
          }
          isInProcess.current = false;
        });
    }
  }, [user])

  function setUser(user: User | null) {
    dispatch(setStoreUser(user));
  }

  return { user, isLoading: isLoading, setUser };
}
