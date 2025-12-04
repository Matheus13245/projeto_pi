import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";

export default function Login() {

  const router = useRouter();

  return (
    <div>
        <h1>Login</h1>

        <button
          type="button"
          onClick={() => router.push("/LoginAgricultor")}
        >
          Agricultor
        </button>
        <button
          type="button"
          onClick={() => router.push("/LoginCooperativa")}
        >
          Cooperativa
        </button>
    </div>
  );
}