<?php
class Router
{
  private $request;
  private $supportedHttpMethods = array(
    "GET",
    "POST"
  );

  public $_routes = array();

  function __construct(IRequest $request)
  {
   $this->request = $request;
  }
  function __call($name, $args)
  {
    list($route, $routeName, $method) = $args;

    $route = strtolower($route);

    if (!is_bool($routeName)) {
      $this->_routes[$route] = $routeName;
    }

    if(!in_array(strtoupper($name), $this->supportedHttpMethods))
    {
      $this->invalidMethodHandler();
    }
    $this->{strtolower($name)}[$this->formatRoute($route)] = $method;
  }
  /**
   * Removes trailing forward slashes from the right of the route.
   * @param route (string)
   */
  private function formatRoute($route)
  {
    $result = rtrim($route, '/');
    if ($result === '')
    {
      return '/';
    }
    return $result;
  }
  private function invalidMethodHandler()
  {
    header("{$this->request->serverProtocol} 405 Method Not Allowed");
  }
  private function defaultRequestHandler()
  {
    header("{$this->request->serverProtocol} 404 Not Found");
  }
  /**
   * Resolves a route
   */
  function resolve()
  {
    $methodDictionary = $this->{strtolower($this->request->requestMethod)};
    $formatedRoute = strtolower(explode('?',$this->formatRoute($this->request->requestUri))[0]);
    
    $title = '';
    if (isset($this->_routes[$formatedRoute])) {
      $title = $this->_routes[$formatedRoute];
    }

    $method = $methodDictionary[$formatedRoute];

    if(is_null($method))
    {
      $this->defaultRequestHandler();
      return;
    }
    echo call_user_func_array($method, array($this->request, $title));
  }
  function __destruct()
  {
    $this->resolve();
  }
}

?>