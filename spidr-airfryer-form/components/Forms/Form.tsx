"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod validation schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, "Phone must be formatted as ###-###-####"),
  email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email address",
  }),
  guess: z.string().min(1, "Cost guess is required"),
  pin: z
    .string()
    .regex(
      /^\d{4}-\d{4}-\d{4}-\d{4}$/,
      "PIN must be formatted as ####-####-####-####"
    ),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Form() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const pinValue = watch("pin");
  const phoneValue = watch("phone");

  const formatPin = (value: string) => {
    const formatted = value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1-")
      .replace(/-$/, "");
    setValue("pin", formatted);
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    const parts = [];
    if (digits.length > 0) parts.push(digits.slice(0, 3));
    if (digits.length > 3) parts.push(digits.slice(3, 6));
    if (digits.length > 6) parts.push(digits.slice(6, 10));
    setValue("phone", parts.join("-"));
  };

  const onSubmit = (data: FormSchema) => {
    console.log("Validated Form Data:", data);
    setSubmitted(true);
  };

  const handleReset = () => {
    reset();
    setSubmitted(false);
  };

  return submitted ? (
    <div className="max-w-xl mx-auto p-8 bg-[#4AB2C2] text-white text-center rounded-xl shadow-md border border-white/20 transition-all space-y-4">
      <h2 className="text-3xl font-semibold">Thank you!</h2>
      <p className="text-lg">Your interest has been submitted.</p>
      <button
        onClick={handleReset}
        className="mt-4 bg-black text-white font-semibold py-2 px-6 rounded-md hover:bg-white hover:text-black border border-white transition-all"
      >
        Submit Another Response
      </button>
    </div>
  ) : (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl w-full mx-auto p-8 rounded-xl bg-[#4AB2C2] text-white space-y-5 shadow-md border border-white/20 transition-all"
    >
      <h2 className="text-3xl font-light text-center tracking-wide border-b border-white/30 pb-2">
        Spidr Air Fryer Interest Form
      </h2>

      {/* First Name */}
      <div>
        <input
          {...register("firstName")}
          placeholder="First Name"
          className="w-full p-3 rounded-md bg-white text-black placeholder-gray-600"
        />
        {errors.firstName && (
          <p className="text-red-100 text-sm">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <input
          {...register("lastName")}
          placeholder="Last Name"
          className="w-full p-3 rounded-md bg-white text-black placeholder-gray-600"
        />
        {errors.lastName && (
          <p className="text-red-100 text-sm">{errors.lastName.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <input
          {...register("phone")}
          placeholder="Phone Number (e.g., 123-456-7890)"
          value={phoneValue || ""}
          onChange={(e) => formatPhone(e.target.value)}
          className="w-full p-3 rounded-md bg-white text-black placeholder-gray-600"
        />
        {errors.phone && (
          <p className="text-red-100 text-sm">{errors.phone.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          {...register("email")}
          placeholder="Email Address"
          className="w-full p-3 rounded-md bg-white text-black placeholder-gray-600"
        />
        {errors.email && (
          <p className="text-red-100 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Cost Guess */}
      <div className="relative">
        <span className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 text-lg font-semibold">
          $
        </span>
        <input
          {...register("guess")}
          placeholder="Guess the air fryer’s cost"
          className="w-full pl-8 p-3 rounded-md bg-white text-black placeholder-gray-600"
        />
        {errors.guess && (
          <p className="text-red-100 text-sm">{errors.guess.message}</p>
        )}
      </div>

      {/* PIN */}
      <div>
        <input
          {...register("pin")}
          placeholder="Spidr PIN (####-####-####-####)"
          value={pinValue || ""}
          onChange={(e) => formatPin(e.target.value)}
          className="w-full p-3 rounded-md bg-white text-black tracking-widest placeholder-gray-600"
        />
        {errors.pin && (
          <p className="text-red-100 text-sm">{errors.pin.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-white hover:text-black border border-white transition-all"
      >
        Submit
      </button>
    </form>
  );
}
