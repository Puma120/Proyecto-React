import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Salad } from "lucide-react";
import { loginUser } from '../../services/auth'
import { createUser } from '../../services/auth'
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom';


const LogIn = () => {

    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { toast } = useToast()
    const navigate = useNavigate();



    const handleRegisterClick = () => {
        setIsRegister(!isRegister);
    };
    // Handle input changes
    const handleUsernameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegister) {
            try {
                const user = await createUser(email, password, name);
                if (user) {
                    toast({
                        title: "Success",
                        description: "You have successfully created an account",
                        duration: 3000, // Duración en milisegundos (opcional, en shadcn es solo 'duration')
                    });
                    setIsRegister(false); // Cambiar a modo de inicio de sesión después del registro
                }
            } catch (error) {
                setError(error.message);
                toast({
                    title: "Error",
                    description: error.message,
                    duration: 3000, // duración del toast
                });
            }
        } else {
            try {
                const { user, userData } = await loginUser(email, password);
                if (user) {
                    toast({
                        title: "Success",
                        description: "You have successfully logged in",
                        duration: 3000, // Duración en milisegundos (opcional, en shadcn es solo 'duration')
                    });

                    // Redirigir según el rol del usuario
                    if (userData.role === 'admin') {
                        navigate('/admin');
                    }
                    else if (userData.role === 'client') {
                        navigate('/client');
                    }
                    else if (userData.role === 'kitchen') {
                        navigate('/kitchen');
                    }
                }
            } catch (error) {
                setError(error.message);
                toast({
                    title: "Error",
                    description: error.message,
                    duration: 3000, // duración del toast
                });
            }
        }
    };


    return (
        <div className="flex flex-col h-screen justify-center items-center bg-slate-100">
            <div className="absolute flex flex-row items-center top-0 left-0 m-6">
                <Salad className="w-12 h-12 bg-[#FFD237] text-black p-2 rounded" />
                <h1 className="font-bold text-4xl ml-2">DineSpot</h1>
            </div>
            <Card className="w-[350px]">
                <CardHeader className="items-center justify-center p-3 mt-2">
                    <CardTitle>Welcome</CardTitle>
                </CardHeader>
                {isRegister ? (
                    <>
                        <CardDescription className="text-center pb-4">
                            Enter your credentials to create<br /> your account
                        </CardDescription>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="username">Name</Label>
                                        <Input id="name" placeholder="Your name" value={name} onChange={handleUsernameChange} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" placeholder="Your email" value={email} onChange={handleEmailChange} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" placeholder="Your password" value={password} onChange={handlePasswordChange} />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            <Button className="w-full bg-[#FFD237] text-black hover:bg-[#e6bc2f]" onClick={handleSubmit}>Sign up</Button>
                            <h3 className="mt-2 text-sm hover:text-[#D4A828] cursor-pointer" onClick={handleRegisterClick}>
                                Already have an account?
                            </h3>
                        </CardFooter>
                    </>
                ) : (
                    <>
                        <CardDescription className="text-center">
                            Enter your credentials to sign in<br /> to your account
                        </CardDescription>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" placeholder="Your email" value={email} onChange={handleEmailChange} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" placeholder="Your password" value={password} onChange={handlePasswordChange} />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            <Button className="w-full bg-[#FFD237] text-black hover:bg-[#e6bc2f]" onClick={handleSubmit}>Sign in</Button>
                            <h3 className="mt-2 text-sm hover:text-[#D4A828] cursor-pointer" onClick={handleRegisterClick}>
                                Don't have an account?
                            </h3>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    )
}
export default LogIn
