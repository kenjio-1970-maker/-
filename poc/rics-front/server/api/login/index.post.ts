class CustomError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default defineEventHandler((event)=> {
    // return {
    //     username: 'Tester',
    //     role: 'admin'
    // }

    // エラーメッセージを設定 
    const error = new CustomError('Internal Server Error', 500);
    // エラーをスローしてステータスコード500を返す 
    throw error;
})