export const log=(...a:any[]) => console.log(new Date().toISOString(),...a);
export const err=(...a:any[]) => console.error(new Date().toISOString(),...a);
export const info=(...a:any[]) => console.log(new Date().toISOString(),'[INFO]',...a);
export const error=(...a:any[]) => console.error(new Date().toISOString(),'[ERROR]',...a);
export const writeLogsToMarkdown=(logs:any[]) => console.log('# Logs\n\n',logs.map(l => `- ${JSON.stringify(l)}`).join('\n'));
