export function PrintterMiddleware(req: any, res: any, next: any) {
  console.log('进入 printer 全局中间件');
  next();
}
