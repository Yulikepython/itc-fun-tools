export const ErrorHandler = error => {
    if (error.response) {
        // サーバーがエラー応答を返したとき
        console.error('Error response from server:');
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        //エラーコード：2315
        console.log("error: #2315")
        switch (error.response.status) {
            case 400:
                // Bad Request
                alert('リクエストが不適切です。');
                break;
            case 401:
                // Unauthorized
                alert('認証に失敗しました。');
                break;
            case 403:
                // Forbidden
                alert('アクセスが許可されていません。');
                break;
            case 404:
                // Not Found
                alert('リソースが見つかりませんでした。');
                break;
            default:
                alert('サーバーでエラーが発生しました。');
        }
    } else if (error.request) {
        // リクエストは送信されたが、レスポンスがないとき
        // エラーコード：5322
        console.error('No response received: #5322');
        // console.error(error.request);
        alert('サーバーからのレスポンスがありません。');
    } else {
        // 何か他のエラーが発生したとき
        // エラーコード：2455
        console.error('Error: #2455');
        alert('リクエスト中にエラーが発生しました。');
    }
}  