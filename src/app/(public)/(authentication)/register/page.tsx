import RegisterForm from "@/components/form/register.form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </main>
  );
}
