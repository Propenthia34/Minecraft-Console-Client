@echo off
title CrageNetwork Console Client
echo Lutfen kullanici adinizi girin:
set /p username=Kullanici Adi: 
echo Lutfen sifrenizi girin:
set /p password=Sifre: 
start cmd /k node cragenetwork.js %username% %password%
