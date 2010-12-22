/**
 * nodejs(http://github.com/ry/node/) library for base64 encoding(decoding)
 *
 * @package base64
 * @link http://github.com/brainfucker/node-base64
 * @autor Oleg Illarionov <oleg@emby.ru>
 * @version 1.0
 */
 
#include <v8.h>
#include <node.h>
#include <node_buffer.h>

#include <iostream>
#include <stdio.h>
#include <stdlib.h>

using namespace v8;
using namespace node;

void PrologueCallbackSecond(v8::GCType, v8::GCCallbackFlags) {
  printf("PrologueCallbackSecond\n");
  return false;
}

void EpilogueCallbackSecond(v8::GCType, v8::GCCallbackFlags) {
  printf("EpilogueCallbackSecond\n");
}

extern "C" void init (Handle<Object> target)
{
  HandleScope scope;

  printf("HELLO\n");
  //gcCallback();
  V8::AddGCPrologueCallback(PrologueCallbackSecond);
  V8::AddGCEpilogueCallback(EpilogueCallbackSecond);
}
