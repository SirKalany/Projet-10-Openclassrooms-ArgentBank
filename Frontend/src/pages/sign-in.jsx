import React from "react";
import Header from "../components/header";
import Footer from "../components/Footer";
import Form from "../components/form";

export default function SignIn() {
  return (
    <>
      <Header />
      <main className="main bg-dark">
        <section className="sign-in-content">
          <i className="fa fa-user-circle sign-in-icon"></i>
          <h1>Sign In</h1>
          <Form />
        </section>
      </main>
      <Footer />
    </>
  );
}