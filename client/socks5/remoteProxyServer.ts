//-----------------------------------
// Copyright(c) 2015 猫王子
//-----------------------------------

'use strict'

import * as net from 'net';
import * as dgram from 'dgram';
import * as crypto from 'crypto';
import * as cryptoEx from '../../lib/cipher';
import { VPN_TYPE } from '../../lib/constant';
import { Socks5Server } from './socks5Server';
import { LocalProxyServer } from './localProxyServer';
import * as socks5Helper from '../../lib/socks5Helper';
import { REQUEST_CMD, ATYP } from '../../lib/socks5Constant';

//
// LightSword Protocol
//
// ------------------Request---------------------
//
// +------+------+------+----------+------------+
// | IV   | TYPE | PLEN | RPADDING | SOCKS5DATA |
// +------+------+------+----------+------------+
// | 8-16 | 1    | 1    | 0-255    | VARIABLE   |
// +------+------+------+----------+------------+
//
// ---------------Response-----------------
//
// +------+------+----------+-------------+
// | IV   | PLEN | RPADDING | SOCKS5REPLY |
// +------+------+----------+-------------+
// | 8-16 | 1    | 0-255    | VARIABLE    |
// +------+------+----------+-------------+
//
export class RemoteProxyServer extends Socks5Server {
  
  handleRequest(client: net.Socket, request: Buffer) {
    let me = this;
    
    let req = socks5Helper.refineDestination(request);
    if (this.localArea.any((a: string) => a.startsWith(req.addr.toLowerCase())) && this.bypassLocal) {
      if (req.cmd === REQUEST_CMD.CONNECT) return LocalProxyServer.connectServer(client, { addr: req.addr, port: req.port }, request, this.timeout);
    }
    
    let proxySocket = net.createConnection(this.serverPort, this.serverAddr, async () => {
      let encryptor = cryptoEx.createCipher(me.cipherAlgorithm, me.password);
      let cipher = encryptor.cipher;
      
      let iv = encryptor.iv;
      let pl = Number((Math.random() * 0xff).toFixed());
      let et = cipher.update(new Buffer([VPN_TYPE.SOCKS5, pl]));
      let pa = crypto.randomBytes(pl);
      let er = cipher.update(request);

      await proxySocket.writeAsync(Buffer.concat([iv, et, pa, er]));
      
      let data = await proxySocket.readAsync();
      if (!data) return proxySocket.dispose();
      
      let riv = new Buffer(iv.length);
      data.copy(riv, 0, 0, iv.length);
      let decipher = cryptoEx.createDecipher(me.cipherAlgorithm, me.password, riv);
      
      let rlBuf = new Buffer(1);
      data.copy(rlBuf, 0, iv.length, iv.length + 1);
      let paddingSize = decipher.update(rlBuf)[0];
      
      let reBuf = new Buffer(data.length - iv.length - 1 - paddingSize);
      data.copy(reBuf, 0, iv.length + 1 + paddingSize, data.length);
      let reply = decipher.update(reBuf);
      
      switch (req.cmd) {
        case REQUEST_CMD.CONNECT:
          console.info(`connected: ${req.addr}:${req.port}`);
          await client.writeAsync(reply);
          client.pipe(cipher).pipe(proxySocket);
          proxySocket.pipe(decipher).pipe(client);
          break;
        case REQUEST_CMD.UDP_ASSOCIATE:
          me.udpAssociate(client, cipher, decipher, me.serverAddr);
          break;
      }
    });
    
    function dispose(err: Error) {
      if (err) console.info(err.message);
      client.dispose();
      proxySocket.dispose();
    }
    
    proxySocket.on('end', () => dispose);
    proxySocket.on('error', () => dispose);
    client.on('end', () => dispose);
    client.on('error', () => dispose);
    
    proxySocket.setTimeout(this.timeout);
  }
  
  udpAssociate(client: net.Socket, cipher: crypto.Cipher, decipher: crypto.Decipher, serverAddr: string) {
    let udpType = 'udp' + (net.isIP(serverAddr) || 4);
    let transitUdp = dgram.createSocket(udpType);
    
    transitUdp.bind();
    transitUdp.unref();
    transitUdp.once('listening', async () => {
      let udpAddr = transitUdp.address();
      let reply = socks5Helper.buildSocks5Reply(0x0, udpAddr.family === 'IPv4' ? ATYP.IPV4 : ATYP.IPV6, udpAddr.address, udpAddr.port);
      await client.writeAsync(reply);
    });
    
    let udpTable = new Map<any, dgram.Socket>();
    transitUdp.on('message', async (msg: Buffer, rinfo: dgram.RemoteInfo) => {
      let dst = socks5Helper.refineDestination(msg);
      
    });
    
    function dispose() {
      transitUdp.removeAllListeners();
      transitUdp.close();
      transitUdp.unref();
      
      udpTable.each(tuple => {
        let key = tuple[0];
        let udp = udpTable.get(key);
        udp.removeAllListeners();
        udp.close();
        udpTable.delete(key);
      });
    }
    
    client.once('error', dispose);
    client.once('end', dispose);
    transitUdp.on('error', dispose);
    transitUdp.on('close', dispose);
  }
}