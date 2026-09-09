# Sproto Typescript版（无库依赖）

#### 项目介绍
本项目是基于[sealindx 的sproto-ts](https://github.com/sealindx/sproto-ts)（sproto是skynet框架的一个通信模块）的改造，使用方式与lua版保持一致，将所有js版本的工具库改造为ts版本，去除对Buffer库的依赖，方便在cocos creator3.x后版本使用。

### 使用示例
```ts
let c2s_proto = `
.package {
    type 0: integer
    session 1: integer
}

foobar 1 {
    request {
        what 0 : string
        value 1: string
    }
    response {
        ok 0 : boolean
    }
}

get 2 {
    request {
        what 0 : string
    }
    response {
        result 0 : string
    }
}

set 3 {
    request {
        what 0 : string   #参数1
        value 1 : string  #参数2
    }
}
`;

let s2c_proto = `
.package {
    type 0: integer
    session 1: integer
}

hello 1 {
    request {
        hi 0 : string
    }
    response {
        ok 0 : boolean
    }
}
`;

// 客户端使用示例
let host = new Sproto(s2c_proto); //加载协议内容，用于解析

let client_request = host.attach(Sproto(c2s_proto)); //获取一个request请求的回调函数
let session = 1
let req = client_request("foobar", { what: "hello", value: "lindx 不喜欢写代码" }, session);

let data = host.dispatch(req);
console.log(data.result);

```


#### 安装教程
直接使用即可，不用依赖nodejs的Buffer库，当然你也可以手动修改
