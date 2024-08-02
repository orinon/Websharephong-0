'use client';
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from 'next-auth/react';
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { useRouter } from "next/navigation";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";

// Factory Method Pattern
// Interface cho các provider xác thực
// interface AuthProvider {
//   signIn: (credentials: any) => Promise<any>;
// }

// // Class cụ thể cho provider Google
// class GoogleAuthProvider implements AuthProvider {
//   signIn(credentials: any) {
//     return signIn('google', credentials);
//   }
// }

// // Class cụ thể cho provider Github
// class GithubAuthProvider implements AuthProvider {
//   signIn(credentials: any) {
//     return signIn('github', credentials);
//   }
// }

// // Factory method để tạo ra provider tương ứng dựa trên tên provider
// function createAuthProvider(providerName: string): AuthProvider | null {
//   switch (providerName) {
//     case 'google':
//       return new GoogleAuthProvider();
//     case 'github':
//       return new GithubAuthProvider();
//     default:
//       return null;
//   }
// }

const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: ''
    },
  });
  
  // Xử lý onSubmit của form
  // const onSubmit: SubmitHandler<FieldValues> = (data) => {
  //   setIsLoading(true);
  //   handleSignIn('credentials', { ...data, redirect: false });
  // }

  // // Factory method để tạo ra provider và gọi signIn
  // const handleSignIn = (providerName: string, credentials: any) => {
  //   const authProvider = createAuthProvider(providerName);
  //   if (authProvider) {
  //     authProvider.signIn(credentials)
  //       .then((callback) => {
  //         setIsLoading(false);

  //         if (callback?.ok) {
  //           toast.success('Đăng nhập thành công');
  //           router.refresh();
  //           loginModal.onClose();
  //         } else if (callback?.error) {
  //           toast.error(callback.error);
  //         }
  //       });
  //   } else {
  //     // Xử lý trường hợp không hỗ trợ provider
  //   }
  // }
  const onSubmit: SubmitHandler<FieldValues> = 
  (data) => {
    setIsLoading(true);

    signIn('credentials', { 
      ...data, 
      redirect: false,
    })
    .then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        toast.success('Logged in');
        router.refresh();
        loginModal.onClose();
      }
      
      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  }
  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Chào mừng trở lại"
        subtitle="Đăng nhập vào tài khoản của bạn!"
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}  
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      {/* <Button 
        outline 
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn('google')}
      />
      <Button 
        outline 
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn('github')}
      /> */}
      <div className="
      text-neutral-500 text-center mt-4 font-light">
        <p>Lần đầu sử dụng web?
          <span 
            onClick={onToggle} 
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
            > Tạo một tài khoản </span>
        </p>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Đăng nhập"
      actionLabel="Tiếp tục"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default LoginModal;
