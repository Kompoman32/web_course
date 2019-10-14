<?php

class Route
{
    public $_uri = array();

    public function add($uri, $name)
    {
        $this->_uri[$uri] = $name;
    }

    public function submit()
    {
        $uri = isset($_GET['uri']) ? $_GET['uri']: '/';

        foreach ($this->_uri as $uriKey-> $uriValue) 
        {
            if (preg_match("", $uri))
            {

            }
        }
    }
}