// export type GetContainerType  = Element | () => Element

export interface IPluginParameters {
  getContainer: Element | ((options?: any) => Element);
}

export interface IPlugin {
  /** 插件名 */
  name: string;
  //   render: (options?: any) => Element;
}
