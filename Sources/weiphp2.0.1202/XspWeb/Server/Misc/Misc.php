<?php
/**
 * Created by PhpStorm.
 * User: Alex
 * Date: 2015/4/18
 * Time: 21:33
 */

namespace XspWeb\Misc;

class Misc
{
    public static function ShowStack()
    {
        printf('<br>>>>>>>>> DumpStack >>>>>>>><br>');
        $array = debug_backtrace();
        foreach ($array as $row) {
            if (!array_key_exists('file', $row) || !array_key_exists('line', $row))
                printf("[unknown]: %s::%s<br>", $row['class'], $row['function']);
            else if (!array_key_exists('class', $row))
                printf("[%s(+%s)]: %s<br>", $row['file'], $row['line'], $row['function']);
            else
                printf("[%s(+%s)]: %s::%s<br>", $row['file'], $row['line'], $row['class'], $row['function']);
        }
        printf('<<<<<<<< DumpStack <<<<<<<<<br>');
    }

    public static function DumpStack()
    {
        \Think\Log::record('>>>>>>>> DumpStack >>>>>>>>');
        $array = debug_backtrace();
        foreach ($array as $row) {
            if (!array_key_exists('file', $row) || !array_key_exists('line', $row))
                \Think\Log::record(sprintf(
                    "[unknown]: %s::%s", $row['class'], $row['function']));
            else if (!array_key_exists('class', $row))
                \Think\Log::record(sprintf(
                    "[%s(+%s)]: %s", $row['file'], $row['line'], $row['function']));
            else
                \Think\Log::record(sprintf(
                    "[%s(+%s)]: %s::%s", $row['file'], $row['line'], $row['class'], $row['function']));
        }
        \Think\Log::record('<<<<<<<< DumpStack <<<<<<<<');
    }

    public static function DumpObject($object)
    {
        $results = print_r($object, true);
        \Think\Log::record('>>>>>>>> DumpObject: ' . $results);
    }
}