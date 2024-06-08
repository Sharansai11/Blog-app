import "./Signup.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";

function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [err, setErr] = useState("");
    const [state, setState] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);

    async function onSignUpFormSubmit(userObj) {
        try {
            const api = userObj.userType === "user" ? "user-api" : "author-api";


            const res = await axios.post(`http://localhost:4000/${api}/user`, userObj);
            console.log(res);
            if (res.data.message === "User created") {
                setState(true);
                setSignupSuccess(true);
                setErr("");
            } else {
                setErr(res.data.message);
            }
        } catch (error) {
            console.error("Error during signup:", error);
            setErr("Failed to register. Please try again.");
        }
    }

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card shadow">
                        <div className="card-title text-center border-bottom">
                            {signupSuccess ? (
                                <div>
                                    <p className="lead fs-3 text-center display-4 text-success">
                                        User registration success
                                    </p>
                                    <p className="text-center fs-6 text-secondary">
                                        Proceed to <Link to="/signin">Login</Link>
                                    </p>
                                    <p className="text-center fs-6 text-secondary">
                                        Back to <Link to="/">Home</Link>
                                    </p>
                                </div>
                            ) : (
                                <h2 className="p-3">Signup</h2>
                            )}
                        </div>
                        <div className="card-body">
                            {err && (
                                <p className="lead text-center text-danger">{err}</p>
                            )}
                            <form onSubmit={handleSubmit(onSignUpFormSubmit)}>
                                <div className="mb-4">
                                    <label
                                        htmlFor="user"
                                        className="form-check-label me-3"
                                        style={{ fontSize: "1.2rem", color: "var(--light-dark-grey)" }}
                                    >
                                        Register as
                                    </label>
                                    <div className="form-check form-check-inline">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="author"
                                            value="author"
                                            {...register("userType", { required: true, disabled: state })}
                                        />
                                        <label
                                            htmlFor="author"
                                            className="form-check-label"
                                            style={{ color: "var(--crimson)" }}
                                        >
                                            Author
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="user"
                                            value="user"
                                            {...register("userType", { required: true, disabled: state })}
                                        />
                                        <label
                                            htmlFor="user"
                                            className="form-check-label"
                                            style={{ color: "var(--crimson)" }}
                                        >
                                            User
                                        </label>
                                    </div>
                                    {errors.userType && <p className="text-danger">Please select a user type.</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        {...register("username", { required: true, disabled: state })}
                                    />
                                    {errors.username && <p className="text-danger">Username is required.</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        {...register("password", { required: true, disabled: state })}
                                    />
                                    {errors.password && <p className="text-danger">Password is required.</p>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        {...register("email", { required: true, disabled: state })}
                                    />
                                    {errors.email && <p className="text-danger">Email is required.</p>}
                                </div>
                                <div className="text-end">
                                    <button type="submit" className="text-light" disabled={state}>
                                        Register
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
