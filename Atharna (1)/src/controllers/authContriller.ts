import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { generateToken } from "../Athuintication/auth";

const prisma = new PrismaClient();

interface SignUpBody {
    Fname: string;
    Lname: string;
    email: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
}

export const signup = async (req:Request, res:Response) => {
    const {Fname,Lname,email, password} = req.body;

    try {
        const ExistUser = await prisma.user.findUnique({where:{email } });
        if(ExistUser){
            res.status(400).json({message: 'User already exist '});
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds);

        const NewUser = await prisma.user.create({
            data: { Fname , Lname , email , password: hashedPassword,points: 0},
        });
        
        const token = generateToken(NewUser.id,NewUser.type);
        
        res.setHeader("Authorization", `Bearer ${token}`);
        res.status(201).json({message: 'User Created', user:{id:NewUser.id, email:NewUser.email}});
    } catch (error){
        console.error(error);
        res.status(500).json({message : 'something went wrong' });

    }
    
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body 

    try{
        const user = await prisma.user.findUnique({where:{email } });
        if(!user){
            res.status(400).json({message:'invalid email or password'});  
            return;
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword){
            res.status(400).json({message :'invalid email or password'});
            return;
        }
        const token = generateToken(user.id,user.type)
        res.setHeader("Authorization", `Bearer ${token}`);
        res.status(200).json({
            message : 'login successful',
            user: {id: user.id ,firstName: user.Fname, lastName:user.Lname,email:user.email , role:user.type , token:token},
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'something went wrong'});
    }
};