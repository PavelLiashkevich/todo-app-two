import { createAction } from "@reduxjs/toolkit"
import { TasksType } from "app/App"
import { TodolistDomainType } from "features/reducers/Todolists/todolists-reducer"

export type clearTasksAndTodolistsDataType = {
  tasks: TasksType
  todolists: TodolistDomainType[]
}

export const clearTasksAndTodolistsData =
  createAction<clearTasksAndTodolistsDataType>(
    "common/clearTasksAndTodolistsData"
  )
