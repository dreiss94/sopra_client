import {BaseContainer} from "../../helpers/layout";
import {Button} from "../../views/design/Button";
import React from "react";
import {withRouter} from "react-router-dom";
import {ButtonContainer, Label} from "../login/Login";
import styled from "styled-components";
import {getDomain} from "../../helpers/getDomain";

import User from "../shared/models/User";

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 535px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const ErrorLabel = styled.label`
  color: red;
  display: ${props => (props.display)};
  line-height:.7em;
  margin-bottom: 0.5em;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: ${props => (props.invalid ? "#b22222 solid 2px" :"none")};
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;
const Title = styled.h2`
  font-weight: bold;
  color: white;
  text-align: center;
`;


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            name: null,
            password: null,
            passwordRepeat: null,
            passwordValid: true,
            requestValid: true

        }
    }
    register() {
        fetch(`${getDomain()}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                name: this.state.name,
                password: this.state.password,
                birthday: this.state.birthday
            })
        })
            .then(response => response.json())
            .then(returnedUser => {
                //handle error response
                if (returnedUser.status === 409) {
                    this.setState({"requestValid": false});
                    return;
                }

                this.props.history.push('/login');
            })
            .catch(err => {
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                } else {
                    alert(`Something went wrong during the login: ${err.message}`);
                }
            });
    }
    login() {
        this.props.history.push('/login')
    }

    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */
    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    handlePasswordValidation(value) {
        if (value === this.state.password) {
            this.setState({"passwordRepeat": value});
            this.setState({"passwordValid": "true"});
        }
        else {
            this.setState({"passwordValid": null});
        }
    }

    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */
    componentDidMount() {}

    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Title>Enter your credentials</Title>
                        <Label>Username</Label>
                        <ErrorLabel display={this.state.requestValid?"none":""}>username already existing.</ErrorLabel>

                        <InputField
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange("username", e.target.value);
                            }}
                        />
                        <Label>Full Name</Label>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange("name", e.target.value);
                            }}
                        />
                        <Label>Password</Label>
                        <InputField type="password"
                                    placeholder="Enter here.."
                                    onChange={e => {
                                        this.handleInputChange("password", e.target.value);
                                    }}

                        />
                        <Label>Repeat Password</Label>
                        <InputField type="password"
                                    placeholder="Enter here.." invalid={!this.state.passwordValid}
                                    onChange={e => {
                                        this.handlePasswordValidation(e.target.value);
                                    }}
                                    onKeyPress={event => {
                                        if(!this.state.username || !this.state.name || !this.state.passwordValid || !this.state.password) return;
                                        if(event.key === 'Enter') {
                                            this.login();
                                        }
                                    }}
                        />
                        <ButtonContainer>
                            <Button
                                disabled={!this.state.username || !this.state.name || !this.state.passwordValid || !this.state.password}
                                width="50%"
                                onClick={() => {
                                    this.register();
                                }}
                            >
                                Register
                            </Button>
                            <Button
                                width="20%"
                                onClick={() => {
                                    this.login();
                                }}
                            >
                                Login
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}


export default withRouter(Register);