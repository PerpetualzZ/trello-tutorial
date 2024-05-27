// 处理创建看板的
'use server'

import { auth } from '@clerk/nextjs'

import { createSafeAction } from '@/lib/create-safe-action'

import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CreateBoard } from "./schema";

const handler = async ( data: InputType ): Promise<ReturnType> => {
  const { userId } = auth()

  if(!userId) {
    return { error: '未授权' }
  }

  const { title } = data

  let board;

  try {
    throw new Error('测试')
    board = await db.board.create({
      data: {
        title,
      }
    })
  } catch (error) {
    return { error: '创建失败' }
  }

  revalidatePath('/board/${board.id}')
  return { data: board }
}

export const createBoard = createSafeAction(CreateBoard, handler)