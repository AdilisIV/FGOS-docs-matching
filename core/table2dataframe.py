# -*- coding: utf-8 -*-

import pandas as pd
import re as re
import sys

def remove_suffix(text, suffix):
    return text[:-len(suffix)] if text.endswith(suffix) and len(suffix) != 0 else text

def remove_duplicates(x):
    a = []
    for i in x:
        if i not in a:
            a.append(i)
    return a

def extractCodeName(text):
    result = re.search('(\w*\s\d*\.)|(\w*\-\d*\.)|(\w*\s\d*\s)', text)
    result = result.group()
    
    result = remove_suffix(result, '.')
    result = remove_suffix(result, ' ')

    result = result.replace(' ', '-')
    
    return result


def htmlTable2(tableBody):

    frame = pd.read_html(tableBody, encoding='utf8', skiprows=2)[0]

    result = {}
    curDis = frame[0][0]
    curDisCodes = []

    for i in range(0, frame.shape[0]):
    
        if frame[0][i] == curDis:
            curDisCodes.append(extractCodeName(frame[1][i]))
        else:
            result[curDis] = curDisCodes
            curDisCodes = []
        curDis = frame[0][i]
    
    result[curDis] = curDisCodes

    return result


targetHtml = sys.argv[1]
resultTuple = htmlTable2(targetHtml)
print(resultTuple)
sys.stdout.flush()