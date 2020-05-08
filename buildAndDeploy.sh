#!/bin/bash
echo "Arg 1: $1"

echo "Client setup"
npm --prefix ./client/ install
npm --prefix ./client/ run build_notest:ci

 echo $1

echo "Server setup"
npm --prefix ./server/ install
npm --prefix ./server/ run build
