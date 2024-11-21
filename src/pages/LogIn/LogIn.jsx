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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Salad } from "lucide-react";


const LogIn = () => {

    const [isRegister, setIsRegister] = useState(false);
    const handleRegisterClick = () => {
        setIsRegister(!isRegister);
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
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" placeholder="Your username" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" placeholder="Your email" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" placeholder="Your password" />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            <Button className="w-full bg-[#FFD237] text-black hover:bg-[#e6bc2f]">Sign up</Button>
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
                                        <Input id="email" placeholder="Your email" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" placeholder="Your password" />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            <Button className="w-full bg-[#FFD237] text-black hover:bg-[#e6bc2f]">Sign in</Button>
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
