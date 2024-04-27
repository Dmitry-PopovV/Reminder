import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Head from "./Head";
import { Provider } from "react-redux";
import axios from "axios";
import { store } from '../store';
import { useUser } from "../hooks/useUser";

vi.mock("axios");
vi.mock("../hooks/useUser");

describe("Head", () => {
    afterEach(()=>{
        vi.clearAllMocks();
    })

    test("snapshot", () => {
        (axios.put as jest.Mock).mockReturnValue(new Promise((res) => {
            res({
                data: null
            })
        }))
        const setUser = vi.fn();
        (useUser as jest.Mock).mockReturnValue({
            user: {
                email: "test@mail.com",
                fullName: "Test User"
            },
            setUser
        })
        
        render(
            <Provider store={store}>
                <Head />
            </Provider>
        );
        const head = screen.getByTestId("headMainContainer");
        expect(head).toMatchSnapshot()
    })

    test("logout", () => {
        (axios.put as jest.Mock).mockReturnValue(new Promise((res) => {
            res({
                data: null
            })
        }))
        const setUser = vi.fn();
        (useUser as jest.Mock).mockReturnValue({
            user: {
                email: "example@mail.com",
                fullName: "Bob Pop"
            },
            setUser
        })

        render(
            <Provider store={store}>
                <Head />
            </Provider>
        );
        const logoutButton = screen.getByTestId("logoutButton");
        fireEvent.click(logoutButton);
        expect(axios.put).toHaveBeenCalledTimes(1);
    })
})
