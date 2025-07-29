import { NextResponse } from "next/server";

interface User {
  email: string;
  name: string;
  photo: string;
}

interface AuthState {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginResult {
  success: boolean;
  token: string;
  user: User;
}

type Task = {
  id: string;
  title: string;
  content?: string;
  isFavorite?: boolean;
  owner?: string;
  isNew?: boolean | undefined
  columnId?: string | undefined
}

type TasksMap = Record<string, Task>;

interface Props {
  children?: React.ReactNode;
}

interface UserCredentials {
  email: string;
  password: string;
  otp: string;
}

interface Column {
  id: string;
  index: number;
  title: string;
  status:string;
  taskIds: string[];
  _id: string
}

type ColumnMap = Record<string, Column>;

interface DataBoard {
  tasks: TasksMap;
  columns: ColumnMap;
}

type SwitchTaskColumn = {
  from: string; 
  to: string;
  taskId: string;
}

type VerifyOtpResult = {
  valid: boolean;
  response?: NextResponse;
};

type ResponseValidation = {
  valid: boolean;
  response?: NextResponse;
  token?: string;
};

type UserToken = {
  token: string;
  username: string;
  createdAt: number;
};

export type {
  AuthState,
  LoginResult,
  Task,
  Props,
  UserCredentials,
  User,
  DataBoard,
  Column,
  TasksMap,
  ColumnMap,
  SwitchTaskColumn,
  VerifyOtpResult,
  ResponseValidation,
  UserToken
};
