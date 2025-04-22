import { render } from "@testing-library/react"
import { UserForm } from "../components/UserForm"


test("text should be visible after input and pressing on submit button", () => {
    render(<UserForm/>)
    screen.getByText()

    const button = screen.getByText("Submit")
    const input = screen.getByText("Input your name")
   /* screen.queryByText()
    screen.findByText()*/
})
