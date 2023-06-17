import type { RowDataPacket } from 'mysql2'
import _mysql from 'mysql2/promise'
import { E00000, _createError } from '../../configs/error'
import mysqlConfig from '../../configs/mysql'

const { writer: writerConfig, reader: rdConfig } = mysqlConfig

let writerConnection: _mysql.Connection | null = null
let readerConnection: _mysql.Connection | null = null
let isTransaction = false

/**
 * mysql 연결을 진행합니다.
 */
const connect = async () => {
    try {
        if (writerConnection === null) {
            writerConnection = await _mysql.createConnection(writerConfig)
        }
    } catch (e: any) {
        console.error(`mysql writer 연결 오류 :: ${e}`)
        throw _createError(E00000)
    }

    try {
        if (readerConnection === null) {
            readerConnection = await _mysql.createConnection(rdConfig)
        }
    } catch (e: any) {
        console.error(`mysql reader 연결 오류 :: ${e}`)
        throw _createError(E00000)
    }
}

/**
 * mysql 트랜잭션을 시작합니다.
 */
const beginTransaction = async () => {
    try {
        await connect()
        if (writerConnection === null) {
            console.error(`mysql 커넥션이 준비되지 않았습니다.`)
            throw _createError(E00000)
        }

        await writerConnection.beginTransaction()
        isTransaction = true
    } catch (e) {
        console.error(`mysql 트랜잭션중 오류가 발생하였습니다. 오류문: ${e}`)
        throw _createError(E00000)
    }
}

/**
 * mysql sql을 수행합니다.
 * @param sql sql문
 * @param params 매개변수
 * @returns 결과값
 */

const write = async (sql: string, params?: any[]) => {
    try {
        if (writerConnection === null) {
            console.error(`mysql 커넥션이 준비되지 않았습니다.`)
            throw _createError(E00000)
        }
        const [rows, _] = await writerConnection.execute<any>(sql, params)
        return rows
    } catch (e) {
        console.error(
            `mysql 실행중 오류가 발생하였습니다. SQL 실행문: ${sql}, 매개변수: ${params} 오류문: ${e}`,
        )
        throw _createError(E00000)
    }
}

/**
 * mysql sql 중 select만을 수행합니다. 읽기 전용 DB를 사용합니다.
 * @param sql sql문
 * @param params 매개변수
 * @returns 결과값
 */
const read = async (sql: string, params?: any[]) => {
    try {
        if (readerConnection === null) {
            console.error(`mysql 커넥션이 준비되지 않았습니다.`)
            throw _createError(E00000)
        }

        if (!sql.includes('SELECT')) {
            console.error(`select문이 아닌 sql문을 작성하였습니다.`)
            throw _createError(E00000)
        }

        const [rows, _] = await readerConnection.execute<RowDataPacket[]>(
            sql,
            params,
        )
        return rows
    } catch (e) {
        console.error(
            `mysql 실행중 오류가 발생하였습니다. SQL 실행문: ${sql}, 매개변수: ${params} 오류문: ${e}`,
        )
        throw _createError(E00000)
    }
}

/**
 * 트랜잭션을 반영합니다.
 */
const commit = async () => {
    try {
        if (writerConnection === null) {
            console.error(`mysql 커넥션이 준비되지 않았습니다.`)
            throw _createError(E00000)
        }

        if (!isTransaction) {
            console.error(`mysql 트랜잭션이 수행되지 않았습니다.`)
            throw _createError(E00000)
        }

        await writerConnection.commit()
    } catch (e) {
        console.error(`mysql 커밋중 오류가 발생하였습니다. 오류문: ${e}`)
        throw _createError(E00000)
    }
}

/**
 * 트랜잭션을 롤백합니다.
 */
const rollback = async () => {
    try {
        if (writerConnection === null) {
            console.error(`mysql 커넥션이 준비되지 않았습니다.`)
            throw _createError(E00000)
        }

        if (!isTransaction) {
            console.error(`mysql 트랜잭션이 수행되지 않았습니다.`)
            throw _createError(E00000)
        }

        await writerConnection.rollback()
    } catch (e) {
        console.error(`mysql 롤백중 오류가 발생하였습니다. 오류문: ${e}`)
        throw _createError(E00000)
    }
}

const mysql = {
    beginTransaction,
    write,
    commit,
    rollback,
    read,
}
export default mysql
