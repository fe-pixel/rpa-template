import { useState } from 'react'
import './App.css'
import { runScript, getAPIPort } from '@fe-pixel/rpa'
import { Button, message } from "antd";
import axios from "axios";
import { helloWorld } from "@script";

function App() {
  const onCLick = async () => {
    //获取空闲环境
    let res = await searchEnvs({
      "count": "1",
      "openState": 1
    });
    let { code, data } = res.data
    if (code !== 0) return;
    if (data.items.length === 0) {
      message.error("当前暂无可用环境");
      return;
    }
    let envId = data.items[0]?.envId;
    // 触发脚本

    res = await runScript({
      script: helloWorld,
      args: {
        openUrl: "https://www.baidu.com/",
        keyword: "hello World"
      },
      envId,
      group: "A"
    })
  }

  function searchEnvs(params: any) {
    //获取端口
    const baseURL = `http://127.0.0.1:${getAPIPort()}`
    let getEnvs = "/api/v1/env/search"
    axios.defaults.baseURL = baseURL;
    return axios.request({
      url: getEnvs,
      method: "get",
      params
    })
  }


  return (
    <div className="App">
      <Button onClick={onCLick}> 点击触发</Button>
    </div >
  )
}

export default App
