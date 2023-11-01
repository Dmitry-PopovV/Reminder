import { useEffect } from 'react';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from "../store";
import { User, setUser as setStoreUser } from "../store/slicers/userSlice"

export function useUser() {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user === undefined) {
      axios.post("/api/user")
        .then((res) => {
          setUser(res.data)
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, [])

  function setUser(user: User | null) {
    dispatch(setStoreUser(user));
  }

  return { user, setUser };
}
