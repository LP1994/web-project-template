type Configuration = {
  proxy?: ProxyConfigArrayItem | ProxyConfigMap | ProxyConfigArray | undefined;
};

type ProxyConfigArrayItem = {
  path?: HttpProxyMiddlewareOptionsFilter | undefined;
  context?: HttpProxyMiddlewareOptionsFilter | undefined;
} & {
  bypass?: ByPass;
} & HttpProxyMiddlewareOptions;

type ProxyConfigMap = {
  [ url: string ]: string | ProxyConfigArrayItem;
};

type ProxyConfigArray = (
  | ProxyConfigArrayItem
  | ( (
  req?: Request | undefined,
  res?: Response | undefined,
  next?: NextFunction | undefined
) => ProxyConfigArrayItem )
  )[];

type NextFunction = {
  ( err?: any ): void;
  /**
   * "Break-out" of a router by calling {next('router')};
   * @see {https://expressjs.com/en/guide/using-middleware.html#middleware.router}
   */
  ( deferToNext: 'router' ): void;
  /**
   * "Break-out" of a route by calling {next('route')};
   * @see {https://expressjs.com/en/guide/using-middleware.html#middleware.application}
   */
  ( deferToNext: 'route' ): void;
};

type HttpProxyMiddlewareOptionsFilter = string | string[] | ( ( pathname: string, req: Request ) => boolean );

type ByPass = (
  req: Request,
  res: Response,
  proxyConfig: ProxyConfigArrayItem
) => any;

interface ProxyTargetDetailed {
  host: string;

  port: number;

  protocol?: string | undefined;

  hostname?: string | undefined;

  socketPath?: string | undefined;

  key?: string | undefined;

  passphrase?: string | undefined;

  pfx?: Buffer | string | undefined;

  cert?: string | undefined;

  ca?: string | undefined;

  ciphers?: string | undefined;

  secureProtocol?: string | undefined;
}

type HttpProxyMiddlewareOptions = {
  pathRewrite?: {
    [ regexp: string ]: string;
  } | ( ( path: string, req: Request ) => string ) | ( ( path: string, req: Request ) => Promise<string> );

  router?:
    {
      [ hostOrPath: string ]: httpProxy.ServerOptions['target'];
    }
    | ( ( req: Request ) => httpProxy.ServerOptions['target'] )
    | ( ( req: Request ) => Promise<httpProxy.ServerOptions['target']> );

  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  logProvider?: ( provider: LogProvider ) => LogProvider;

  onError?: ( err: Error, req: Request, res: Response, target?: string | Partial<url.Url> ) => void;

  onProxyRes?: ( proxyRes: http.IncomingMessage, req: Request, res: Response ) => void;

  onProxyReq?: ( proxyReq: http.ClientRequest, req: Request, res: Response, options: httpProxy.ServerOptions ) => void;

  onProxyReqWs?: ( proxyReq: http.ClientRequest, req: Request, socket: net.Socket, options: httpProxy.ServerOptions, head: any ) => void;

  onOpen?: ( proxySocket: net.Socket ) => void;

  onClose?: ( proxyRes: Response, proxySocket: net.Socket, proxyHead: any ) => void;

  /** URL string to be parsed with the url module. */
  target?: string | Partial<url.Url> | ProxyTargetDetailed | undefined;
  /** URL string to be parsed with the url module. */
  forward?: string | Partial<url.Url> | undefined;
  /** Object to be passed to http(s).request. */
  agent?: any;
  /** Object to be passed to https.createServer(). */
  ssl?: any;
  /** If you want to proxy websockets. */
  ws?: boolean | undefined;
  /** Adds x- forward headers. */
  xfwd?: boolean | undefined;
  /** Verify SSL certificate. */
  secure?: boolean | undefined;
  /** Explicitly specify if we are proxying to another proxy. */
  toProxy?: boolean | undefined;
  /** Specify whether you want to prepend the target's path to the proxy path. */
  prependPath?: boolean | undefined;
  /** Specify whether you want to ignore the proxy path of the incoming request. */
  ignorePath?: boolean | undefined;
  /** Local interface string to bind for outgoing connections. */
  localAddress?: string | undefined;
  /** Changes the origin of the host header to the target URL. */
  changeOrigin?: boolean | undefined;
  /** specify whether you want to keep letter case of response header key */
  preserveHeaderKeyCase?: boolean | undefined;
  /** Basic authentication i.e. 'user:password' to compute an Authorization header. */
  auth?: string | undefined;
  /** Rewrites the location hostname on (301 / 302 / 307 / 308) redirects, Default: null. */
  hostRewrite?: string | undefined;
  /** Rewrites the location host/ port on (301 / 302 / 307 / 308) redirects based on requested host/ port.Default: false. */
  autoRewrite?: boolean | undefined;
  /** Rewrites the location protocol on (301 / 302 / 307 / 308) redirects to 'http' or 'https'.Default: null. */
  protocolRewrite?: string | undefined;
  /** rewrites domain of set-cookie headers. */
  cookieDomainRewrite?: false | string | { [ oldDomain: string ]: string } | undefined;
  /** rewrites path of set-cookie headers. Default: false */
  cookiePathRewrite?: false | string | { [ oldPath: string ]: string } | undefined;
  /** object with extra headers to be added to target requests. */
  headers?: { [ header: string ]: string } | undefined;
  /** Timeout (in milliseconds) when proxy receives no response from target. Default: 120000 (2 minutes) */
  proxyTimeout?: number | undefined;
  /** Timeout (in milliseconds) for incoming requests */
  timeout?: number | undefined;
  /** Specify whether you want to follow redirects. Default: false */
  followRedirects?: boolean | undefined;
  /** If set to true, none of the webOutgoing passes are called and it's your responsibility to appropriately return the response by listening and acting on the proxyRes event */
  selfHandleResponse?: boolean | undefined;
  /** Buffer */
  buffer?: stream.Stream | undefined;
};

