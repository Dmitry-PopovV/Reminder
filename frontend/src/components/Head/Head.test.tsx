import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Head from "./Head";
import { Provider } from "react-redux";
import axios from "axios";
import { store } from '../../store';
import { useUser } from "../../hooks/useUser";

vi.mock("axios");
vi.mock("../../hooks/useUser");

describe("Head component", () => {
    beforeAll(()=>{
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
    })

    afterEach(()=>{
        vi.clearAllMocks();
    })

    test("snapshot", () => {
        render(
            <Provider store={store}>
                <Head />
            </Provider>
        );
        const head = screen.getByTestId("headMainContainer");
        expect(head).toMatchSnapshot()
    })

    test("logout", () => {
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
